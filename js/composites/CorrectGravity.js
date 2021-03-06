import React from "react";
import PropTypes from "prop-types";

import { Gravity, GravityHelp, NumberField } from '../components';
import { FormGroup, StaticFormGroup } from './form';
import { calculateGravityCorrection } from "../calculation";
import {formatAsFloat, formatNumber} from "../helpers/format";
import { validateGravity } from "../validations";

const calculate = ( volume, measured_gravity, target_gravity ) => {
    volume           = formatAsFloat( volume );
    measured_gravity = formatAsFloat( measured_gravity );
    target_gravity   = formatAsFloat( target_gravity );

    if ( volume === '' || volume < 1 || volume > 500 ) {
        return '';
    }

    if ( ! validateGravity( measured_gravity ) || ! validateGravity( target_gravity ) ) {
        return '';
    }

    let result = calculateGravityCorrection( volume, measured_gravity, target_gravity );

    if ( result === '' ) {
       return '';
    }

    switch( result.action ) {
        case 'do_nothing' :
            return "Het SG komt overeen met het doel SG.";
        case "add_water" :
            if ( ! isNaN( result.amount ) ) {
                return "Voeg " + formatNumber( result.amount ) + " liter water toe om het SG te verlagen.";
            }
            break;
        case "add_sugar" :
            if ( ! isNaN( result.amount ) ) {
                return "Voeg " + Math.round( result.amount ) + " gram suiker toe om het SG te verhogen.";
            }
            break;
    }

    return '';
};

const CorrectGravity = ( props ) => {
    const { volume, measured_gravity, target_gravity } = props;

    let result = calculate( volume, measured_gravity, target_gravity );

    return (
        <div className="form-horizontal">
            <FormGroup id="volume" label="Volume in liters" help="De waarde liters moet liggen tussen de 1 en 500." >
                <NumberField
                    className="form-control"
                    id="volume"
                    name='volume'
                    onChange={ props.setVolume }
                    value={props.volume}
                    placeholder="Volume in liters"
                    min="1"
                    max="500"
                    describedBy={ "help-volume" }
                />
            </FormGroup>
            <FormGroup id="measured_gravity" label="Gemeten SG" help={ GravityHelp }>
                <Gravity
                    className="form-control"
                    id="measured_gravity"
                    name='measured_gravity'
                    onChange={ props.setMeasuredGravity }
                    gravity={ props.measured_gravity }
                    placeholder="Gemeten SG"
                    describedBy={ "help-measured_gravity" }
                />
            </FormGroup>
            <FormGroup id="target_gravity" label="Doel SG" help={ GravityHelp }>
                <Gravity
                    className="form-control"
                    id="target_gravity"
                    name='target_gravity'
                    onChange={ props.setTargetGravity }
                    gravity={ props.target_gravity }
                    placeholder="Doel SG"
                    describedBy={ "help-target_gravity" }
                />
            </FormGroup>
            <StaticFormGroup id="correctGravityResult" label="Wat te doen" value={ result } />
        </div>
    );
};

CorrectGravity.propTypes = {
    setVolume: PropTypes.func.isRequired,
    setMeasuredGravity: PropTypes.func.isRequired,
    setTargetGravity: PropTypes.func.isRequired,
    volume: PropTypes.string,
    measured_gravity: PropTypes.string,
    target_gravity: PropTypes.string,
};

CorrectGravity.defaultProps = {
    volume : "",
    measured_gravity: "",
    target_gravity: "",
};

export default CorrectGravity;
