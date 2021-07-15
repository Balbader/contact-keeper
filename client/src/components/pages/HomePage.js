import React from 'react';
import seminar from './seminar-594125_1920.jpg';
import './HomePage.css';

const HomePage = () => {
	return (
		<div className=''>
			<header className="hero-container">
				<img src={seminar} alt='seminar' className='' />
			</header>
			<div className="welcome">
				<h1>Welcome to Contact Keeper</h1>
			</div>
		</div>
	)
}

export default HomePage;