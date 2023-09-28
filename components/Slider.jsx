import React from 'react'
import { SliderData } from './SliderData';
import Image from 'next/image';

const Slider = ({slides}) => {
  return (
    <div id='trending-papers'>
        <h1>Trending Papers</h1>
        <div>
            {SliderData.map((Slider, index) => { 
                return (
                <Image
                 src={Slider.paper} 
                 alt='/'
                 width='1440'
                 height='600'
                 objectFit='cover'
                 />
                )})}
        </div>
    </div>
  )
}

export default Slider;