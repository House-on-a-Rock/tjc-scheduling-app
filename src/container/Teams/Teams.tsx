import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { AxiosResponse, AxiosError } from 'axios';

import { createStyles, makeStyles, Theme } from '@material-ui/core';

import { TeamsContainer } from './TeamsContainer';

import { getAllTeamsData, getChurchMembersData } from '../../query';

import { loadingTheme } from '../../shared/styles/theme';

interface TeamsProps {
  churchId: number;
}

export const Teams = ({ churchId }: TeamsProps) => {
  const queryClient = useQueryClient();
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState(null);

  const [isSuccess, setIsSuccess] = useState<string>('');
  const teams = useQuery(['teams', churchId], () => getAllTeamsData(churchId), {
    refetchOnWindowFocus: false,
    staleTime: 100000000000000,
  });

  const users = useQuery(['users', churchId], () => getChurchMembersData(churchId), {
    enabled: !!churchId,
    staleTime: 300000,
    cacheTime: 3000000,
    onSuccess: (data) => {
      const formattedData = [];
      data.map((user) => {
        formattedData.push({
          id: user.userId,
          name: `${user.firstName} ${user.lastName}`,
        });
      });
      setUserData(formattedData);
    },
  });

  useEffect(() => {
    if (teams.isSuccess) setError(null);
    if (teams.isError) setError(teams.error);

    if (teams.isLoading !== isLoading) setIsLoading(teams.isLoading);
  }, [teams]);

  console.log(teams.data);
  return (
    <div className={!userData || !teams.data ? classes.loading : ''}>
      {teams.data && userData && (
        <TeamsContainer teamsData={teams.data} users={userData} />
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
