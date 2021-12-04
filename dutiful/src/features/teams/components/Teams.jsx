import { useEffect, useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { TableHeader, TableBody, Table } from 'components/table';
import { Pagination } from 'components/pagination';
import { BottomNavigation } from 'components/navigation';
import { teamManagementColumns } from 'features/management';
import { useTeams } from '../apis';

export const Teams = () => {
  const classes = useStyles();
  const { data } = useTeams(2);
  const [teams, setTeams] = useState([{}]);
  const [step, setStep] = useState(0);

  const users = teams[step].users;
  const pagination = users?.length > 10;
  const columns = useMemo(() => teamManagementColumns, []);

  useEffect(() => {
    if (!data) return;
    setTeams(data.filter((team) => !!team.users.length));
  }, [data]);

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        {users && (
          <Table
            columns={columns}
            data={users}
            paginatable={pagination}
            initialState={{ pageSize: 15 }}
          >
            {TableHeader}
            {TableBody}
            {pagination &&
              ((methods) =>
                (methods.pageOptions.length > 1 || methods.data.length > 20) && (
                  <Pagination
                    methods={methods}
                    withInput={methods.pageOptions.length > 5}
                    withPageSize={methods.data.length > 20}
                    className={classes.pagination}
                  />
                ))}
          </Table>
        )}
      </div>
      <div className={classes.footer}>
        {teams && (
          <BottomNavigation activeStep={step} setActiveStep={setStep} data={teams} />
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: { width: '100%', display: 'flex', flexDirection: 'column' },
  content: {
    flexGrow: 1,
    height: '80vh',
    overflow: 'scroll',
    marginBottom: theme.spacing(3),
  },
  footer: { flexShrink: 0 },
}));
