import React from "react";
import css from './OngoingOrders.module.css';

const OngoingPrders = props =>{
    const {setShowOngoingOrders} = props;
    return (

        <div className={css.container}>
            <div className={css.tb_con}>
                <div className={css.flex_row_btw}>
                    <div className={css.close_btn} onClick={e=>setShowOngoingOrders(false)}>
                        <svg className={css.close_icon} xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                            <path d="M2.05086 1.13616C1.66033 0.745631 1.02717 0.74563 0.636643 1.13616C0.246119 1.52668 0.246119 2.15984 0.636643 2.55037L5.58639 7.50012L0.636643 12.4499C0.246119 12.8404 0.246119 13.4736 0.636643 13.8641C1.02717 14.2546 1.66033 14.2546 2.05086 13.8641L7.0006 8.91433L11.9504 13.8641C12.3409 14.2546 12.974 14.2546 13.3646 13.8641C13.7551 13.4736 13.7551 12.8404 13.3646 12.4499L8.41482 7.50012L13.3646 2.55037C13.7551 2.15984 13.7551 1.52668 13.3646 1.13616C12.974 0.745631 12.3409 0.745631 11.9504 1.13616L7.0006 6.0859L2.05086 1.13616Z" fill="black"/>
                        </svg>
                    </div>
                    <h1 className={css.header}>View your orders</h1>
                    
                </div>
                <div className={css.action_con}>
                    <div className={css.flex_row}>
                        <button className={css.active}>All</button>
                        <button>Completed</button>
                        <button>Ongoing</button>
                    </div>
                    <div className={css.flex_row}>
                        <div className={css.search_con}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.33398 1.33398C4.02028 1.33398 1.33398 4.02028 1.33398 7.33398C1.33398 10.6477 4.02028 13.334 7.33398 13.334C8.75066 13.334 10.0527 12.843 11.0791 12.0219L13.5292 14.4721C13.7896 14.7324 14.2117 14.7324 14.4721 14.4721C14.7324 14.2117 14.7324 13.7896 14.4721 13.5292L12.0219 11.0791C12.843 10.0527 13.334 8.75066 13.334 7.33398C13.334 4.02028 10.6477 1.33398 7.33398 1.33398ZM2.66732 7.33398C2.66732 4.75666 4.75666 2.66732 7.33398 2.66732C9.91131 2.66732 12.0007 4.75666 12.0007 7.33398C12.0007 9.91131 9.91131 12.0007 7.33398 12.0007C4.75666 12.0007 2.66732 9.91131 2.66732 7.33398Z" fill="#7A7A7A"/>
                            </svg>
                            <input className={css.search_input} type="text" placeholder="Search orders" />
                        </div>
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M7.9161 1.45898C7.56972 1.45898 7.25945 1.67326 7.13678 1.99719L6.94545 2.50243C6.5353 2.46144 6.15741 2.42054 5.8515 2.38619C5.62282 2.36052 5.43484 2.33856 5.30427 2.32305L5.15364 2.30497L5.10249 2.29871C4.64574 2.24216 4.22898 2.56649 4.17242 3.02324C4.11586 3.47999 4.44027 3.89611 4.89702 3.95267L4.95268 3.95947L5.10766 3.97808C5.24128 3.99395 5.43284 4.01632 5.66553 4.04245C6.1305 4.09466 6.76158 4.16206 7.4237 4.22248C8.31685 4.30399 9.29587 4.37565 9.99944 4.37565C10.703 4.37565 11.682 4.30399 12.5752 4.22248C13.2373 4.16206 13.8684 4.09466 14.3333 4.04245C14.566 4.01632 14.7576 3.99395 14.8912 3.97808L15.0462 3.95947L15.1017 3.95268C15.5585 3.89612 15.883 3.47999 15.8265 3.02324C15.7699 2.56649 15.3538 2.24208 14.897 2.29863L14.8452 2.30497L14.6946 2.32305C14.564 2.33856 14.376 2.36052 14.1474 2.38619C13.8415 2.42054 13.4636 2.46144 13.0534 2.50243L12.8621 1.99719C12.7394 1.67326 12.4292 1.45898 12.0828 1.45898H7.9161Z" fill="#7A7A7A"/>
                                <path d="M9.1661 9.79232C9.1661 9.33208 8.79301 8.95898 8.33277 8.95898C7.87253 8.95898 7.49944 9.33208 7.49944 9.79232V13.959C7.49944 14.4192 7.87253 14.7923 8.33277 14.7923C8.79301 14.7923 9.1661 14.4192 9.1661 13.959V9.79232Z" fill="#7A7A7A"/>
                                <path d="M11.6661 8.95898C12.1263 8.95898 12.4994 9.33208 12.4994 9.79232V13.959C12.4994 14.4192 12.1263 14.7923 11.6661 14.7923C11.2059 14.7923 10.8328 14.4192 10.8328 13.959V9.79232C10.8328 9.33208 11.2059 8.95898 11.6661 8.95898Z" fill="#7A7A7A"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.7575 6.70945C15.833 5.65214 14.9215 4.80451 13.8855 4.92423C12.8255 5.04674 11.1897 5.20898 9.99944 5.20898C8.80915 5.20898 7.17339 5.04674 6.11336 4.92423C5.07742 4.80451 4.16587 5.65214 4.24139 6.70945L4.95534 16.7047C5.00946 17.4624 5.57382 18.103 6.34831 18.2194C7.17881 18.3443 8.70272 18.5438 10.0004 18.5423C11.2821 18.5408 12.8122 18.3422 13.6464 18.2184C14.4222 18.1034 14.9894 17.4623 15.0437 16.7024L15.7575 6.70945ZM14.0769 6.57988C14.0797 6.57955 14.082 6.57974 14.082 6.57974L14.0842 6.58025C14.086 6.58089 14.0889 6.58241 14.0918 6.58513C14.0937 6.58693 14.0951 6.58913 14.0951 6.58913L14.095 6.5907L13.382 16.5728C12.5565 16.6948 11.1415 16.8743 9.99847 16.8757C8.84301 16.877 7.43683 16.6972 6.61695 16.5744L5.90382 6.5907L5.90376 6.58913C5.90376 6.58913 5.90518 6.58693 5.90708 6.58513C5.90995 6.58241 5.91286 6.58089 5.91471 6.58025L5.91691 6.57974C5.91691 6.57974 5.91913 6.57955 5.92202 6.57988C6.98392 6.7026 8.70397 6.87565 9.99944 6.87565C11.2949 6.87565 13.0149 6.7026 14.0769 6.57988Z" fill="#7A7A7A"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <table className={css.trx_table}>
                    <tr className={css.trx_header}>
                        <th>S/N</th>
                        <th>Client</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>Matha Ruis</td>
                        <td>Cathering Service</td>
                        <td>02/04/2024</td>
                        <td>€ 250</td>
                        <td><button className={css.completed}>Completed</button></td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Matha Ruis</td>
                        <td>Cathering Service</td>
                        <td>02/04/2024</td>
                        <td>€ 250</td>
                        <td><button className={css.completed}>Completed</button></td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>Matha Ruis</td>
                        <td>Cathering Service</td>
                        <td>02/04/2024</td>
                        <td>€ 250</td>
                        <td><button className={css.ongoing}>Ongoing</button></td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Matha Ruis</td>
                        <td>Cathering Service</td>
                        <td>02/04/2024</td>
                        <td>€ 250</td>
                        <td><button className={css.completed}>Completed</button></td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>Matha Ruis</td>
                        <td>Cathering Service</td>
                        <td>02/04/2024</td>
                        <td>€ 250</td>
                        <td><button className={css.ongoing}>Ongoing</button></td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Matha Ruis</td>
                        <td>Cathering Service</td>
                        <td>02/04/2024</td>
                        <td>€ 250</td>
                        <td><button className={css.completed}>Completed</button></td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>Matha Ruis</td>
                        <td>Cathering Service</td>
                        <td>02/04/2024</td>
                        <td>€ 250</td>
                        <td><button className={css.ongoing}>Ongoing</button></td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Matha Ruis</td>
                        <td>Cathering Service</td>
                        <td>02/04/2024</td>
                        <td>€ 250</td>
                        <td><button className={css.completed}>Completed</button></td>
                    </tr>
                    
                </table>
            </div>
        </div>
          
    )
}

export default OngoingPrders;