/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { ZXCVBNResult } from 'zxcvbn';
import './PasswordStrengthMeter.css';

interface PasswordStrengthMeterProps {
  password: string;
  strength: string;
  testedResult: ZXCVBNResult;
}

export const PasswordStrengthMeter = ({
  password,
  strength,
  testedResult,
}: PasswordStrengthMeterProps) => {
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
