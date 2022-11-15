import { useRef, useEffect } from 'react';

import { List, FieldType, ColumnType, ActionType, TypedField, IColumn, IListAction, useArrayPaginator, usePrompt, SelectionMode, IListApi } from 'react-declarative';

import Delete from '@mui/icons-material/Delete';
import Add from '@mui/icons-material/Add';

import { observer } from 'mobx-react';

import ioc from '../lib/ioc';

const filters: TypedField[] = [
    {
        type: FieldType.Text,
        name: 'content',
        title: 'Content',
    },
    {
        type: FieldType.Checkbox,
        name: 'isDeleted',
        title: 'Deleted',
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
        headerName: 'Content',
        primary: true,
        field: 'content',
        width: (fullWidth) => Math.max(fullWidth - 350, 200),
    },
    {
        type: ColumnType.CheckBox,
        headerName: 'Deleted',
        primary: true,
        field: 'isDeleted',
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
                label: 'Create todo',
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
        label: 'Delete todo',
        action: 'remove-action',
        icon: Delete,
    },
];

const heightRequest = () => window.innerHeight - 20;

export const MainPage = observer(() => {

    const listApiRef = useRef<IListApi>(null as never);

    const pickPrompt = usePrompt({
        title: 'Create a todo',
        placeholder: 'Todo content',
    });

    const handler = useArrayPaginator(async () => await ioc.contractService.todosOfEveryone(), {
        onLoadStart: () => ioc.layoutService.setAppbarLoader(true),
        onLoadEnd: () => ioc.layoutService.setAppbarLoader(false),
    });

    useEffect(() => ioc.contractService.updateSubject.subscribe(async () => {
        await listApiRef.current.reload();
    }), [ioc.contractService.updateSubject]);

    const handleRowActionsClick = async (action: string, row: any) => {
        ioc.layoutService.setAppbarLoader(true);
        try {
            if (action === 'remove-action') {
                await ioc.contractService.removeTodoById(row.id);
                // await listApiRef.current.reload();
            }
        } catch {
            ioc.alertService.notify('An error acquired')
        } finally {
            ioc.layoutService.setAppbarLoader(false);
        }
    };

    const handleAddTodo = async (content: string) => {
        ioc.layoutService.setAppbarLoader(true);
        try {
            await ioc.contractService.addTodo(content);
            // await listApiRef.current.reload();
        } catch {
            ioc.alertService.notify('An error acquired')
        } finally {
            ioc.layoutService.setAppbarLoader(false);
        }
    };

    const handleAction = (action: string) => {
        if (action === 'add-action') {
            pickPrompt().then((data) => {
                if (data) {
                    handleAddTodo(data);
                }
            });
        }
    };

    return (
        <List
            apiRef={listApiRef}
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
