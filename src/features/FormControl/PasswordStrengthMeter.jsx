import PropTypes from 'prop-types';
import './PasswordStrengthMeter.css';

const PasswordStrengthMeter = ({ password, strength, testedResult }) => {
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

PasswordStrengthMeter.propTypes = {
  password: PropTypes.string,
  strength: PropTypes.string,
  testedResult: PropTypes.object,
};

export default PasswordStrengthMeter;
