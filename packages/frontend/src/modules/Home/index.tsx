import React from 'react'
import { Link } from 'react-router-dom'

export const Home = () => {
    return (
        <div className="h-screen flex justify-between">
            <div className="w-1/2 flex flex-col p-5">
                <div>Earn money on your time</div>
                <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad quia maxime sapiente voluptate nam eum. Incidunt tempora reiciendis sint minima.</div>
                <div className="flex justify-evenly">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 m-9 border border-blue-700 rounded">
                        <Link to="/profile">Mint time NFT</Link>
                    </button>
                    <button className="bg-white hover:bg-blue-100 text-blue-500 font-bold py-2 px-3 m-9 border border-blue-700 rounded">
                        <Link to="/marketplace">Explore marketplace</Link>
                    </button>
                </div>
            </div >
            <div className="w1/2 mx-auto">Image</div>
        </div >
    )
}
