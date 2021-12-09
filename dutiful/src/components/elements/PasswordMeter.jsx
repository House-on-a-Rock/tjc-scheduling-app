import React from 'react';
import zxcvbn from 'zxcvbn';
import { makeStyles } from '@material-ui/core/styles';
import './PasswordMeter.css';

export const PasswordStrengthMeter = ({ password = '' }) => {
  const result = zxcvbn(password);
  const strength = testStrength(result);
  return (
    password && (
      <div className="password-strength-meter">
        <progress
          className={`password-strength-meter-progress strength-${strength}`}
          value={result.score}
          max="4"
        />
        <br />
        <label className="password-strength-meter-label">
          {password && (
            <>
              <strong>Password strength:</strong> {strength}
            </>
          )}
        </label>
      </div>
    )
  );
};

function testStrength(result) {
  switch (result.score) {
    case 0:
      return 'Weak';
    case 1:
      return 'Weak';
    case 2:
      return 'Fair';
    case 3:
      return 'Good';
    case 4:
      return 'Strong';
    default:
      return 'Weak';
  }
}

const useStyles = makeStyles((theme) => ({
  password: { textAlign: 'left' },
  progress: {
    // -webkit-appearance: none;
    appearance: 'none',
    width: '250px',
    height: '12px',
  },
}));
