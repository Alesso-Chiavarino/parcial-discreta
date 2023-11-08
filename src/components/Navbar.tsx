const Navbar = () => {
    return (
        <nav className='px-5 border-b-2 p-2 flex items-center justify-between'>
            <a href="/">
                <h1 className='flex items-center gap-1 text-2xl font-bold'>
                    <span>Graph</span>
                    <span className='text-violet-400'>Designer</span>
                </h1>
            </a>
            <div className="flex items-center gap-1 font-semibold text-violet-300">
                <span>&copy;</span>
                <a className="hover:text-violet-400" target="_blank" href="https://github.com/Alesso-Chiavarino">Alessandro Chiavarino</a>
                <span>y</span>
                <a className="hover:text-violet-400" target="_blank" href="https://github.com/franmunoz1">Francisco Muñoz</a>
            </div>
        </nav>
    )
}

export default Navbar