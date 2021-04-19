/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import './PasswordStrengthMeter.css';


export const PasswordStrengthMeter = ({
  password,
  strength,
  testedResult,
}) => {
  return (
    <div className="password-strength-meter">
      <progress
        className={`password-strength-meter-progress strength-${strength}`}
        value={testedResult.score}
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
  );
};
