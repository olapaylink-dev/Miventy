import { denormalisedResponseEntities } from '../../util/data';
import { storableError } from '../../util/errors';
import { currentUserShowSuccess, fetchCurrentUser } from '../../ducks/user.duck';
import { types as sdkTypes} from '../../util/sdkLoader';
import { updateListingRequest, updateListingSuccess } from '../EditListingPage/EditListingPage.duck';
import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';
const { UUID } = sdkTypes;

// ================ Action types ================ //

export const CLEAR_UPDATED_FORM = 'app/ProfileSettingsPage/CLEAR_UPDATED_FORM';

export const UPLOAD_IMAGE_REQUEST = 'app/ProfileSettingsPage/UPLOAD_IMAGE_REQUEST';
export const UPLOAD_IMAGE_SUCCESS = 'app/ProfileSettingsPage/UPLOAD_IMAGE_SUCCESS';
export const UPLOAD_IMAGE_ERROR = 'app/ProfileSettingsPage/UPLOAD_IMAGE_ERROR';

export const UPDATE_PROFILE_REQUEST = 'app/ProfileSettingsPage/UPDATE_PROFILE_REQUEST';
export const UPDATE_PROFILE_SUCCESS = 'app/ProfileSettingsPage/UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_ERROR = 'app/ProfileSettingsPage/UPDATE_PROFILE_ERROR';

// ================ Reducer ================ //

const initialState = {
  image: null,
  uploadImageError: null,
  uploadInProgress: false,
  updateInProgress: false,
  updateProfileError: null,
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case UPLOAD_IMAGE_REQUEST:
      // payload.params: { id: 'tempId', file }
      return {
        ...state,
        image: { ...payload.params },
        uploadInProgress: true,
        uploadImageError: null,
      };
    case UPLOAD_IMAGE_SUCCESS: {
      // payload: { id: 'tempId', uploadedImage }
      const { id, uploadedImage ,listingId,isCoverPhoto} = payload;
      const { file } = state.image || {};
      const image = { id, imageId: uploadedImage.id, file, uploadedImage ,listingId,isCoverPhoto};
      return { ...state, image, uploadInProgress: false };
    }
    case UPLOAD_IMAGE_ERROR: {
      // eslint-disable-next-line no-console
      return { ...state, image: null, uploadInProgress: false, uploadImageError: payload.error };
    }

    case UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        updateInProgress: true,
        updateProfileError: null,
      };
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        image: null,
        updateInProgress: false,
      };
    case UPDATE_PROFILE_ERROR:
      return {
        ...state,
        image: null,
        updateInProgress: false,
        updateProfileError: payload,
      };

    case CLEAR_UPDATED_FORM:
      return { ...state, updateProfileError: null, uploadImageError: null };

    default:
      return state;
  }
}

// ================ Selectors ================ //

// ================ Action creators ================ //

export const clearUpdatedForm = () => ({
  type: CLEAR_UPDATED_FORM,
});

// SDK method: images.upload
export const uploadImageRequest = params => ({ type: UPLOAD_IMAGE_REQUEST, payload: { params } });
export const uploadImageSuccess = result => ({ type: UPLOAD_IMAGE_SUCCESS, payload: result.data });
export const uploadImageError = error => ({
  type: UPLOAD_IMAGE_ERROR,
  payload: error,
  error: true,
});

// SDK method: sdk.currentUser.updateProfile
export const updateProfileRequest = params => ({
  type: UPDATE_PROFILE_REQUEST,
  payload: { params },
});
export const updateProfileSuccess = result => ({
  type: UPDATE_PROFILE_SUCCESS,
  payload: result.data,
});
export const updateProfileError = error => ({
  type: UPDATE_PROFILE_ERROR,
  payload: error,
  error: true,
});

// ================ Thunk ================ //

// Images return imageId which we need to map with previously generated temporary id
export function uploadImage(actionPayload) {

  return (dispatch, getState, sdk) => {
    console.log(actionPayload);
    const { id, imageId, file ,listingId,isCoverPhoto,imgNum,catalogId,catalog,newCatData,itemName,folderName} = actionPayload;
    dispatch(uploadImageRequest(actionPayload));
    console.log(actionPayload);
    const bodyParams = {
      image: actionPayload.file,
    };
    const queryParams = {
      expand: true,
    };

    const insertNewCatalogImage = (catalog,newImageData) =>{//newImageData    {imgNum,imgUrl}
      let data = catalog;
      data.map((itm,k)=>{
        if(itm.itemName === itemName){
          //Get other images, except the one we want to update
          const remainingImgs = itm.catalogImages !== undefined?itm.catalogImages.filter(i=>i.imgNum !== imgNum):[];
          itm.catalogImages = [...remainingImgs,newImageData];
        }
      })
      return data;
    }

    const queryParams2 = {
      expand: true,
      include: ['author', 'images','currentStock'],
              'fields.listing': [
                'title',
                'geolocation',
                'price',
                'deleted',
                'state',
                'reviews',
                'publicData.listingType',
                'publicData.catalog',
                'publicData.coverPhoto',
                'publicData.transactionProcessAlias',
                'publicData.unitType',
              ],
              'fields.user': ['profile.displayName', 'profile.abbreviatedName'],
              'fields.image': [
                'variants.scaled-small',
                'variants.scaled-medium',
                'landscape-crop'
              ],
              'limit.images': 100,
    };


    return sdk.images
      .upload(bodyParams, queryParams)
      .then(resp => {
        const uploadedImage = resp.data.data;
        console.log(resp.data.data);

        //If is listing image
        //add image to listing
        //Add image to listing
        if(listingId !== undefined){
          sdk.ownListings.addImage({
            id: new UUID(listingId.uuid || listingId),
            imageId: new UUID(uploadedImage.id.uuid)
            }, {
              expand: true,
              include: ["images"]
            }).then(res => {
              // res.data
              //const newCatDat = insertNewCatalogImage(catalog,{imgNum,imgUrl: uploadedImage.attributes.variants['default'].url});
              const newCatDatCreated = newCatData && insertNewCatalogImage(newCatData.publicData.catalog,{imgNum,imgUrl: uploadedImage.attributes.variants['default'].url,imageId:uploadedImage.id.uuid});
                if( isCoverPhoto !== undefined && isCoverPhoto){
                  if(folderName !== undefined && folderName !== null && folderName !== ""){
                    const listing = res.data.data;
                    //Get existing catalogImages
                    const existingCatalogImages = listing?.attributes?.publicData?.coverImages;
                    //Remove current coverPhoto if exist
                    let edittedCatalogImage = [];
                    if(existingCatalogImages !== undefined){
                      const otherImages = existingCatalogImages.filter(itm=>itm.folderName !== folderName);
                      edittedCatalogImage = [...otherImages,{folderName,imgUrl: uploadedImage.attributes.variants['default'].url}];
                    }else{
                      edittedCatalogImage = [{folderName,imgUrl: uploadedImage.attributes.variants['default'].url}];
                    }
                    
                    //Add this new coverPhoto to catalogImages
                    //Save it 
                    sdk.ownListings
                        .update(
                        {id:new UUID(listingId.uuid), publicData:{coverImages:edittedCatalogImage}},queryParams2
                      )
                      .then(response => {
                        console.log("Image added ===============1111111111111111111111====================");
                        dispatch(uploadImageSuccess({ data: { id, uploadedImage,listingId,isCoverPhoto} }));
                        dispatch(updateListingSuccess(response));
                        dispatch(addMarketplaceEntities(response));
                        dispatch(fetchCurrentUser());
                      })
                  }else{
                     sdk.ownListings
                        .update(
                        {id:new UUID(listingId.uuid), publicData:{coverPhoto:uploadedImage.attributes.variants['default'].url}},queryParams2
                      )
                      .then(response => {
                        console.log("Image added ===============1111111111111111111111====================");
                        dispatch(uploadImageSuccess({ data: { id, uploadedImage,listingId,isCoverPhoto} }));
                        dispatch(updateListingSuccess(response));
                        dispatch(addMarketplaceEntities(response));
                        dispatch(fetchCurrentUser());
                      })
                  }
                 
                }
                // else if(catalogId !== undefined && imgNum !== undefined && newCatDatCreated.length ){
                //     sdk.ownListings
                //         .update(
                //         {
                //           id:new UUID(listingId.uuid), 
                //           publicData:{catalog: newCatDat}}
                //         )
                //         .then(response => {
                //           console.log("Image added ===============33333333333333333333====================");
                //         })
                // }
                else if(newCatDatCreated !== undefined){
                    sdk.ownListings
                        .update(
                        {
                          id:new UUID(listingId), 
                          publicData:{catalog: newCatDatCreated}},
                          queryParams2
                        )
                        .then(response => {
                          console.log("Image added ===============33333333333333333333====================");
                          dispatch(uploadImageSuccess({ data: { id, uploadedImage,listingId,isCoverPhoto} }));
                          dispatch(updateListingSuccess(response));
                          dispatch(addMarketplaceEntities(response));
                          dispatch(fetchCurrentUser());
                        })
                }
              
            });

        }else{
          dispatch(uploadImageSuccess({ data: { id, uploadedImage} }));
        }
         
       
      })
      .catch(e => dispatch(uploadImageError({ id, error: storableError(e) })));
  };
}


export const updateProfile = actionPayload => {
  return (dispatch, getState, sdk) => {
    dispatch(updateProfileRequest());
    console.log("=====================================");
    const queryParams = {
      expand: true,
      include: ['profileImage'],
    };

    return sdk.currentUser
      .updateProfile(actionPayload, queryParams)
      .then(response => {
        dispatch(fetchCurrentUser({}));
        dispatch(updateProfileSuccess(response));
        console.log("================11111111111111111111111=====================");
        const entities = denormalisedResponseEntities(response);
        if (entities.length !== 1) {
          throw new Error('Expected a resource in the sdk.currentUser.updateProfile response');
        }
        const currentUser = entities[0];

        // Update current user in state.user.currentUser through user.duck.js
        dispatch(currentUserShowSuccess(currentUser));
      })
      .catch(e =>{
        console.log(e);
        dispatch(updateProfileError(storableError(e)));
      });
  };
};
