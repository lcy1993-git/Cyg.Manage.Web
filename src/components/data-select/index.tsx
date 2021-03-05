import React from 'react';

import { Select } from 'antd';

interface DataSlectProps {
    needFilter?: boolean
    options: any[]
}

const withDataSelect = <P extends {}>(WrapperComponent: React.ComponentType<P>) => (
    props: P & DataSlectProps,
) => {
    const {
        needFilter = true,
        options,
        ...rest
    } = props;

    return (
        <WrapperComponent
            showSearch={needFilter}
            options={options}
            {...((rest as unknown) as P)}
            filterOption={(input: string, option: any) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
        />
    );
};

export default withDataSelect(Select);
