import { Grid, makeStyles } from '@material-ui/core';
import { useUsers } from '../apis/users';

// TODO guests

export const UsersTable = ({ churchId }) => {
  const { data } = useUsers(churchId);
  return (
    <div className={''}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          HI
          {/* DATA GRID */}
        </Grid>
      </Grid>
      {/* CRUD/RequestAvailabilitiesDialog DIALOGS */}
    </div>
  );
};

const useStyles = makeStyles(() => ({}));

// export function updateSelectedRows(start, end, data) {
//   const newRows = [];
//   let startPushing = false;
//   const vectoredData = start < end ? data : data.reverse();

//   for (let i = 0; i < vectoredData.length; i++) {
//     if (startPushing) {
//       newRows.push(vectoredData[i].userId);
//       if (vectoredData[i].userId === end) break;
//     }
//     if (vectoredData[i].userId === start) startPushing = true;
//   }

//   // bug 1- hold the shift button down and continually select items. doesn't work as expected
//   // bug 2- this function only works on ordered id
//   return newRows;
// }
