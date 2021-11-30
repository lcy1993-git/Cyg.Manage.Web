import { HTMLAttributes, ImgHTMLAttributes } from 'react'

export type Img = HTMLAttributes<HTMLImageElement> & ImgHTMLAttributes<HTMLImageElement>

interface ImageProps extends Img {
  name: string
  ext: string
}

const Image = ({ name, ext, alt, ...rest }: ImageProps) => (
  <img {...rest} alt={alt || name} src={require(`./assets/images/${name}.${ext}`)} />
)

export default Image

export const Street = (props: Img) => <Image name="街道图" ext="png" {...props} />

export const Satellite = (props: Img) => <Image name="卫星图" ext="png" {...props} />
