import { useEffect, useState } from "react"
import css from './RadioSelect.module.css';
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import classNames from "classnames";


export default function PriceSelect(props){
    const {
        history,
        selectedPrice,
        selectedLocation,
        selectedOption,
        setSelectedPrice,
        parentClicked,
        setParentClicked,
        show,
        setShow
    } = props;
    const [currOption,setCurrOption] = useState("");
    const [selectedSortOption,setSelectedSortOption] = useState("");
    
    const sortOptions = [
        "€0 - €300",
        "€300 - €600",
        "€600+"
    ];

    useEffect(()=>{
        if(parentClicked){
            setParentClicked(false);
            setShow(false);
            
        }
    },[parentClicked])

    const handleChange = (e,val)=>{
        e.preventDefault();
        e.stopPropagation();
        setCurrOption(val);
        setShow(false);
        
        if(val === "€0 - €300"){
            history.push(`/s?price=${0}%2C${300}`);
        }else if(val === "€300 - €600"){
            history.push(`/s?price=${300}%2C${600}`);
        }else if(val === "€600+"){
            history.push(`/s?price=${600}%2C${10000}`);
        }else{}
        setSelectedPrice(val);

    }
    return             (
        <div onClick={e=>{setShow(!show); e.preventDefault(); e.stopPropagation();}} className={css.container}>
        <div className={css.label} >
            <span >{currOption !== ""?currOption:"Price Range"} </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1.87675 5.81879L7.08651 10.7221C7.59991 11.2053 8.40075 11.2053 8.91415 10.7221L14.1239 5.81879C14.392 5.56645 14.4048 5.14453 14.1525 4.87642C13.9001 4.6083 13.4782 4.59552 13.2101 4.84786L8.00033 9.75116L2.79057 4.84786C2.52245 4.59551 2.10054 4.6083 1.84819 4.87642C1.59585 5.14453 1.60864 5.56645 1.87675 5.81879Z" fill="black"/>
            </svg>
        </div>
        {show?
                <FormControl className={css.full_w}>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue={selectedSortOption}
                        name="radio-buttons-group"
                        value={currOption}
                    >

                        {sortOptions.map((option,key)=>{

                        return(
                            <FormControlLabel key={`radio ${option} ${key}`} className={css.no_spacing} onClick={e=>handleChange(e,option)} value={option} control={
                            <Radio
                                sx={{
                                    color: "#D0D5DD",
                                    '&.Mui-checked': {
                                    color: "#F56630",
                                    },
                                }}
                            className={classNames(css.no_spacing,css.radio)}/>} label={option} />
                            )

                        })}
                    </RadioGroup>
                </FormControl>
            :""}
            

        </div>
        

    ) 
    
    
}