import useQRCodeGenerator from 'react-hook-qrcode-svg'
import './index.scss'

export default (props: {
    value: string,
    size?: number,
    level?: 'L' | 'M' | 'Q' | 'H',
    border?: number,
}) => {
    const { value, size = 256, level = 'Q', border = 1 } = props
    const { path, viewBox } = useQRCodeGenerator(value, level, border)
    return <div className="qrcode-container" style={{ width: size }}>
        <div className='value'>{value}</div>
        <svg
            width={size}
            height={size}
            viewBox={viewBox}
            stroke='none'
        >
            <rect width='100%' height='100%' fill='#ffffff' />
            <path d={path} fill='#000000' />
        </svg>
    </div>

}