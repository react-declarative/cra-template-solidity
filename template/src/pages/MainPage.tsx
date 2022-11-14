import { List, FieldType, ColumnType, ActionType, TypedField, IColumn, IListAction, useArrayPaginator, SelectionMode } from 'react-declarative';

import Delete from '@mui/icons-material/Delete';
import Add from '@mui/icons-material/Add';

import { observer } from 'mobx-react';

import ioc from '../lib/ioc';

const filters: TypedField[] = [
    {
        type: FieldType.Text,
        name: 'title',
        title: 'Title',
    },
    {
        type: FieldType.Checkbox,
        name: 'completed',
        title: 'Completed',
    },
];

const columns: IColumn[] = [
    {
        type: ColumnType.Text,
        field: 'id',
        headerName: 'ID',
        secondary: true,
        width: () => 50,
    },
    {
        type: ColumnType.Text,
        headerName: 'Title',
        primary: true,
        field: 'title',
        width: (fullWidth) => Math.max(fullWidth - 350, 200),
    },
    {
        type: ColumnType.CheckBox,
        headerName: 'Completed',
        primary: true,
        field: 'completed',
        width: () => 100,
    },
    {
        type: ColumnType.Action,
        headerName: 'Actions',
        sortable: false,
        width: () => 100,
    },
];

const actions: IListAction[] = [
    {
        type: ActionType.Add,
        action: 'add-action',
    },
    {
        type: ActionType.Menu,
        options: [
            {
                action: 'add-action',
                label: 'Create new row',
                icon: Add,
            },
            {
                action: 'update-now',
            },
        ],
    }
];

const rowActions = [
    {
        label: 'Remove action',
        action: 'remove-action',
        icon: Delete,
    },
];

const heightRequest = () => window.innerHeight - 10;

export const MainPage = observer(() => {

    const handler = useArrayPaginator(async () => [], {
        onLoadStart: () => ioc.layoutService.setAppbarLoader(true),
        onLoadEnd: () => ioc.layoutService.setAppbarLoader(false),
    });

    const handleRowActionsClick = (action: string, row: any) => {
        alert(JSON.stringify({ row, action }, null, 2));
    };

    const handleAction = (action: string) => {
        alert(action);
    };

    return (
        <List
            title="Todo list"
            filterLabel="Filters"
            heightRequest={heightRequest}
            rowActions={rowActions}
            actions={actions}
            filters={filters}
            columns={columns}
            handler={handler}
            onRowAction={handleRowActionsClick}
            onAction={handleAction}
            selectionMode={SelectionMode.Multiple}
        />
    );
});

export default MainPage;
