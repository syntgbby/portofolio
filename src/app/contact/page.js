import { useState, useEffect } from 'react'

export default function Contact(){
    return (
        <> 
        <h2 className="text-center text-2xl w-full">Get In Touch</h2>

        <p className="text-center margin-0 mx-auto w-2/3">
            lorem ipsum loremlorem
            ipsum lorem ipsum lorem ipsum lorem ipsum
        </p>

        <div className="flex mt-16">
            <div className="w-full md:w-3/4 border">
                <div className="bg-white p-10 rounded-lg">
                    <h3 className="text-2xl py-2 mb-10">Leave a Message</h3>

                        <div className="flex gap-6">
                            <div>
                                <label>Name </label>
                                <input type="text" className="border my-input-text "/>
                            </div>
                            <div className="w-full">
                                <label>Email </label>
                                <input type="text" className="border my-input-text w-full"/>
                            </div>
                        </div>

                        <div className="w-full my-2">
                            <label>Subject </label>
                            <input type="text" className="my-input-text w-full"/>
                        </div>
                        <div className="w-full mb-5">
                            <label>Message </label>
                            <textarea className="border my-input-text w-full"></textarea>
                        </div>
                        <div className="w-full py-2">
                            <button className="mx-1 h-9 items-center justify-center px-4 rounded-md bg-amber-500">
                                <label>Send Message</label>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-3/4 border">
                kanan
                </div>   
        </div>
        </>
    );
}