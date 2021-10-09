

interface VirtualScrollProps {
  data: any[];
  component: (a: any) => React.ReactElement
}

const VirtualScroll: React.FC<VirtualScrollProps> = ({data, component}) => {
  return <div>
    this is a list
      {
        data.map((i: any) => {
          return component(i)
        })
      }
  </div>
}

export default VirtualScroll;