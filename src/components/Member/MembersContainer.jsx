import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import MembersMain from './MembersMain';

import { addUser, destroyUser } from '../../query/apis';
import useMembersContainerData from '../../hooks/containerHooks/useMembersContainerData';

import { createStyles, makeStyles } from '@material-ui/core';
import { loadingTheme } from '../../shared/styles/theme';

// TODO fix this thingy

const MembersContainer = ({ churchId }) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();

  const [isUsersLoading, users, createUser, deleteUser] = useMembersContainerData(
    churchId,
  );

  // can pbly condense this down to just members main

  return (
    <div className={isUsersLoading ? classes.loading : ''}>
      <MembersMain
        state={{ data, isLoading, error, isSuccess }}
        addUser={(newInfo) => createUser.mutate({ ...newInfo, churchId })}
        removeUser={(info) => deleteUser.mutate(info)}
        // addSchedule={(newInfo: NewScheduleData) =>
        //   createSchedule.mutate({ ...newInfo, churchId })
        // }
        // removeSchedule={(info: DeleteScheduleData) => deleteSchedule.mutate(info)}
      />
    </div>
  );
};

const useStyles = makeStyles(() =>
  createStyles({
    loading: {
      ...loadingTheme,
    },
  }),
);

function errorHandling(result, setError) {
  setError({
    status: result.response.status,
    message: result.response.statusText,
  });
}

MembersContainer.propTypes = {
  churchId: PropTypes.number,
};

export default MembersContainer;
