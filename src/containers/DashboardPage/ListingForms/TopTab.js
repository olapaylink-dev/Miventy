import React from "react";
import css  from './TopTab.module.css';
import classNames from "classnames";
import { FormattedMessage, useIntl } from '../../../util/reactIntl';

const TopTab = props=>{
    const intl = useIntl();
    const {activeTab,subHeader,instruction,handleChangeTab} = props;
    return(
        <>
            <div className={css.tabs_con}>
                
                <span className={classNames(css.tab_item, (activeTab === "about"?css.active:""))} onClick={e=>handleChangeTab(e,"about")}>
                   {intl.formatMessage({id: 'TopTab.about',})} 
                </span>
                <span className={classNames(css.tab_item, (activeTab === "catalog"?css.active:""))} onClick={e=>handleChangeTab(e,"catalog")}>
                   {intl.formatMessage({id: 'TopTab.catalog',})} 
                </span>
                <span className={classNames(css.tab_item, (activeTab === "publish"?css.active:""))} onClick={e=>handleChangeTab(e,"publish")}>
                   {intl.formatMessage({id: 'TopTab.publish',})}
                </span>
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