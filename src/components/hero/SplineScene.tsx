'use client'
import Spline from '@splinetool/react-spline'

export default function SplineScene() {
  return (
    <div className="absolute inset-0  w-full h-full">
      <Spline 
        className="w-full h-full"
        scene="https://r2.51xmi.com/pichub/scene.splinecode/1745910900213/scene.splinecode" 
      />
    </div>
  )
}