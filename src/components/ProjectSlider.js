import React, { Component } from "react";
import Slider from "react-slick";
import { library } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import releaseData from './release.json';

import "./css/ProjectSlider.css";

library.add(far);

const ProjectSlider = () => {
    const releaseItems = releaseData;
    const settings = {
        dots: true,
        lazyLoad: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        initialSlide: 0
    };


    return (
        <div className="slider">
            <div >
                <Slider {...settings}>

                    {releaseItems.map(item => (
                        <div className="slider-interval">
                            <div key={item.id} class="slider-content">
                                <div class="top-content"> {item.title}</div>
                                <div class="left-content">
                                    <img src={item.pic} alt='' />
                                </div>
                                <div class="right-content">
                                    <p class="time-info">{item.time}</p>
                                    <p class="content-description" dangerouslySetInnerHTML={{ __html: item.content }} />
                                    <div class="icon-links">
                                        {item.code ? <div class="icon-item"><FontAwesomeIcon icon="fa-regular fa-file-code" /> <a href={item.code}>Code</a></div> : null}
                                        {item.paper ? <div class="icon-item"><FontAwesomeIcon icon="fa-regular fa-file-lines" /> <a href={item.paper}>Paper</a></div> : null}
                                        {item.video ? <div class="icon-item"><FontAwesomeIcon icon="fa-regular fa-circle-play" /> <a href={item.code}>Video</a></div> : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                </Slider>
            </div>
        </div>
    );
}

export default ProjectSlider;