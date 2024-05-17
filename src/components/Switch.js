import React, { useState } from 'react';

const Switch = ({ onToggle }) => {
    const [isEnabled, setIsEnabled] = useState(false);

    const toggleSwitch = () => {
        const newState = !isEnabled
        setIsEnabled(newState);
        onToggle(newState);
    };

    return (
        <div
            className={`switchpack  ${isEnabled ? 'switch-pack-on' : 'switch-pack-off'}`}>
            <div className={"switch"}>
                <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={toggleSwitch}
                    style={{ display: 'none' }} // 隐藏原生checkbox
                />
                <div
                    className={`switchdot ${isEnabled ? 'switch-on' : 'switch-off'}`}
                    onClick={toggleSwitch}
                >
                </div>

            </div>
        </div>
    );
};

export default Switch;