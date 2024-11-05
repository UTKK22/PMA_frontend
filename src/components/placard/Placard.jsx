import React from 'react';
import styles from './Placard.module.css';
import Astrologo from '../../assets/Astro_logo.png';

const Placard = () => {
    return (
        <div className={styles.placardContainer}>
            <div className={styles.circle}></div>
            <img src={Astrologo} className={styles.img} alt="Placard" />
            <h1>Welcome Aboard, My Friend!</h1>
            <p>just a couple of clicks and we start.</p>
        </div>
    );
};

export default Placard;
