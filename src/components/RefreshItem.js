import React from 'react';
import styled, { keyframes } from 'styled-components';
import refresh_icon from '../img/refresh.png';

const ItemWrapper = styled.div`
    width: 23.5849%;
    height: 234.5px;
    margin-bottom: 20px;
    padding-bottom: 60px;

    display: flex;
    justify-content: center;
    align-items: center;

    ${props => props.hidden ? 'visbility: hidden; position: absolute;' : ''}
`;

const RotateAnimation = keyframes`
    from { transform: rotate(0deg) scaleX(-1); }
    to   { transform: rotate(360deg) scaleX(-1); }
`;

const RefreshIcon = styled.img`
    width: 60px;
    height: auto;
    animation: ${RotateAnimation} 2s linear infinite;
`;

const RefreshItem = React.memo(({ hidden }) => {
    return (
        <ItemWrapper hidden={hidden}>
            <RefreshIcon src={refresh_icon} />
        </ItemWrapper>
    );
});

export default RefreshItem;
  