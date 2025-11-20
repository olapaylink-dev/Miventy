import React, { useRef, useState } from "react";
import css from './EditableSelectInput.module.css';

const EditableSelectInput = props =>{

    const {selectedFolderName, setSelectedFolderName,folders} = props;

    const [showOptions, setShowOptions] = useState(false);
    const [showAddOptions, setShowAddOptions] = useState(false);
    const [newOption, setNewOption] = useState("");
    const [options, setOptions] = useState(folders !== undefined && folders.length > 0? [...folders]:[]);
    const inputRef = useRef(null);

    const handleCreateFolder = e =>{
        e.preventDefault();
        e.stopPropagation();
        console.log("Clicked");
        setShowAddOptions(true);
    }

    const handleOptionSelected = e=>{
        setSelectedFolderName(e.target.innerHTML);
    }

    const handleShowOption = e =>{
        setShowOptions(!showOptions);
    }

    const handleAddFolder = e=>{
        e.preventDefault();
        e.stopPropagation();
        setOptions([...options,newOption]);
        inputRef.current.value = "";
        setShowAddOptions(false);
    }

    const handleSaveValue = e=>{
        setNewOption(e.target.value);
    }

    return(
        <div className={css.container} onClick={handleShowOption}>
            
            <div>{selectedFolderName}</div>
            {showOptions?
                <div className={css.select_options}>
                    <div className={css.create_new_folder} onClick={handleCreateFolder}>Create new folder</div>
                    {showAddOptions?
                        <div className={css.add_input_con}>
                            <input ref={inputRef} onClick={handleCreateFolder} onChange={handleSaveValue} type="text" placeholder="Type folder name"/>
                            <button onClick={handleAddFolder} className={css.add_btn}>Add</button>
                        </div>
                    :""}
                    
                    {options.map((option,key)=>{
                        return (
                                <div className={css.options} onClick={handleOptionSelected}>{option}</div>
                        )
                    })}
                </div>
            :""}
            
        </div>
    )
}

export default EditableSelectInput;