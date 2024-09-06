import React, {FC} from 'react';
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {IOverlayComponent} from "@/types/IOverlay";

const OverlayTriggerComponent:FC<IOverlayComponent> = ({messageValue, component}) => {
    const renderOverlay = (props: any) => (
        <Tooltip id="button-tooltip" {...props}>
            {messageValue}
        </Tooltip>
    );

    return (
        <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderOverlay}
        >
            {component}
        </OverlayTrigger>
    );
}

export default OverlayTriggerComponent;