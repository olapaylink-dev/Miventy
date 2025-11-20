import React from "react";
import css  from './TopTab.module.css';
import classNames from "classnames";

const TopTab = props=>{
    const {activeTab,subHeader,instruction,handleChangeTab} = props;
    return(
        <>
            <div className={css.tabs_con}>
                
                <span className={classNames(css.tab_item, (activeTab === "about"?css.active:""))} onClick={e=>handleChangeTab(e,"about")}>About service</span>
                <span className={classNames(css.tab_item, (activeTab === "catalog"?css.active:""))} onClick={e=>handleChangeTab(e,"catalog")}>Catalog</span>
                <span className={classNames(css.tab_item, (activeTab === "publish"?css.active:""))} onClick={e=>handleChangeTab(e,"publish")}>Publish</span>
            </div>
             <div className={css.section_gray}>
                <span className={css.header}>{subHeader}</span>
                <p>
                   {instruction}
                </p>
            </div>
        </>
    )
}

export default TopTab;