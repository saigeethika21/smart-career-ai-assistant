import React from 'react';

const Loader: React.FC<{ message: string }> = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-white/50 rounded-lg">
            <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-rose-500"></div>
            <p className="text-lg font-medium text-slate-700">{message}</p>
        </div>
    );
};

export default Loader;