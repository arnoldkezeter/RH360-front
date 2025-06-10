import React from 'react';

interface ButtonOutlineProps {
    handle: () => void;
    title: string;
}

const ButtonOutline = ({ handle, title }: ButtonOutlineProps) => {
    return (
        <button
            className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1
                 dark:border-strokedark dark:text-white text-sm"
            onClick={handle}
        >
            {title}
        </button>
    );
};

export default ButtonOutline;
