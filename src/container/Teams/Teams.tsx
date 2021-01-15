import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { v4 as uuid } from 'uuid';

import { createStyles, makeStyles, Theme } from '@material-ui/core';

import { TeamsContainer } from './TeamsContainer';

import { getAllTeamsData, getChurchMembersData } from '../../query';

import { loadingTheme } from '../../shared/styles/theme';
import { TeamData } from '../../components/Teams/models';

interface TeamsProps {
  churchId: number;
}

export const Teams = ({ churchId }: TeamsProps) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<TeamData[]>(null);
  const [error, setError] = useState(null);

  const [isSuccess, setIsSuccess] = useState<string>('');

  const users = useQuery(['users', churchId], () => getChurchMembersData(churchId), {
    enabled: !!churchId,
    staleTime: 300000,
    cacheTime: 3000000,
  });

  const teams = useQuery(['teams', churchId], () => getAllTeamsData(churchId), {
    refetchOnWindowFocus: false,
    staleTime: 100000000000000,
  });

  // useEffect(() => {
  //   if (teams.isSuccess) setError(null);
  //   if (teams.isError) setError(teams.error);

  //   if (teams.isLoading !== isLoading) setIsLoading(teams.isLoading);
  // }, [setUserData]);

  console.log(userData, teams.data);
  return (
    <div className={!users.data || !teams.data ? classes.loading : ''}>
      {teams.data && users.data && (
        <TeamsContainer teamsData={teams.data} usersData={users.data} />
      )}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loading: {
      ...loadingTheme,
    },
  }),
);
