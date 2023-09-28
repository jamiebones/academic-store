import Link from 'next/link'
import React, { useState, useEffect } from 'react'

function Paper(props) {
    const [title, setTitle] = useState("");
    const [abstract, setAbstract] = useState("");
    const [author, setAuthor] = useState("");
    const [keywords, setKeywords] = useState("");
    const [field, setField] = useState("");
    const [publishIn, setPublishIn] = useState("");

    useEffect(() => {
        props.tags.map(({ name, value }, i) => {
            switch (name) {
                case "title":
                    setTitle(value);
                    break;
                case "abstract":
                    setAbstract(value);
                    break;
                case "publishIn":
                    setPublishIn(value);
                    break;
                case "author":
                    setAuthor(value);
                    break;
                case "field":
                    setField(value);
                    break;
                case "keywords":
                    setKeywords(value);
                    break;
            }
        })
    }, [])
    return (
        <div className='flex justify-around' key={props.id}>
            <div className='flex flex-col w-3/4'>
                <Link className='text-lg text-blue-800 hover:underline' href={`/paper/${props.id}`}>{title}</Link>
                <p className='text-sm text-green-600'>{author} -
                    <span>{publishIn}</span>
                </p>
                <p className='text-sm text-gray-600'>{abstract.slice(0, 100)}.......{abstract.slice(-100)}</p>
            </div>
            <div className='flex'>
                <Link
                    href={`https://arweave.net/${props.id}`}
                    target='_blank'
                    className='text-blue-800 hover:underline'
                >
                    [PDF]
                </Link>
            </div>
        </div>
    )
}

export default Paper