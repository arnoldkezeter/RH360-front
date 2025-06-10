import Image from './../../images/pages/empty-box.png'

function EmptyImage() {
    return (
        <img className='bg-contain' src={Image} alt='empty image' />
    )
}

export default EmptyImage