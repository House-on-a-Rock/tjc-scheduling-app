import { useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { TableHeader, TableBody, Table } from 'components/table';
import { Pagination } from 'components/pagination';
import { BottomNavigation } from 'components/navigation';
import { useTeams } from '../apis';

export const Teams = () => {
  const classes = useStyles();
  const { data: teams } = useTeams(2);
  const [step, setStep] = useState(0);
  const pagination = teams?.[step].users.length > 10;
  const users = teams?.[step].users;

  const columns = useMemo(() => defaultColumns, []);

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        {teams && (
          <Table
            columns={columns}
            data={users}
            paginatable={pagination}
            initialState={{ pageSize: 15 }}
          >
            {TableHeader}
            {TableBody}
            {pagination &&
              ((methods) => {
                return (
                  (methods.pageOptions.length > 1 || methods.data.length > 20) && (
                    <Pagination
                      methods={methods}
                      withInput={methods.pageOptions.length > 5}
                      withPageSize={methods.data.length > 20}
                      className={classes.pagination}
                    />
                  )
                );
              })}
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
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flexGrow: 1,
    height: '80vh',
    overflow: 'scroll',
    marginBottom: theme.spacing(3),
  },
  footer: { flexShrink: 0 },
  button: {},
  selected: {
    backgroundColor: theme.palette.primary.light,
    color: 'white',
  },
}));

// TODO Roles Management
// Allowing your users to assign roles for other users is not just basic, it’s critical. The most basic approach would be to assign each user a specific role within your SaaS application. There are also several more advanced approaches for handling assignment of roles for your users:

// Multiple Roles — Some apps allow you to add multiple roles for users. In case those roles include a set of permissions, then the user would be allowed to perform any of the actions that exist in any or all of the roles assigned to them.
// Custom Roles — More advanced, enterprise-facing apps will allow admins of customers, to create their own custom role sets and even override existing, pre-defined roles.
// Specific Access — Some apps let you choose the specific module/section access for each user. This can be achieved by taking a pure role-based access approach as well, although it sometimes allows for higher granularity on the allowed actions within the product.

// TODO  Constructing a Role Statement

const defaultColumns = [
  { Header: 'First Name', accessor: 'firstName' },
  { Header: 'Last Name', accessor: 'lastName' },
  { Header: 'Team Lead', accessor: 'teamLead' },
];
