import { Select } from 'antd'
import React from 'react'

interface DataSlectProps {
  needFilter?: boolean
  options: any[]
}

const withDataSelect =
  <P extends {}>(WrapperComponent: React.ComponentType<P>) =>
  (props: P & DataSlectProps) => {
    const { needFilter = true, options, ...rest } = props

    return (
      <WrapperComponent
        showSearch={needFilter}
        options={options}
        {...(rest as unknown as P)}
        filterOption={(input: string, option: any) => {
          if (option.label.props) {
            return (
              option.label.props?.children[0].props?.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            )
          }
          return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }}
      />
    )
  }

export default withDataSelect(Select)
