import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import equal from 'fast-deep-equal';

import Button from '@material-ui/core/Button';

const list2 = []

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

// Move item from one list to other
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 10;

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    background: isDragging ? '#f6f6f6' : '#c7ffd8',

    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? '#e36bae' : '#cfe8fc',
    padding: grid,
    width: 250
});

class MultipleDragList extends Component {

    componentDidMount() {
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        const list2 = rememberMe ? JSON.parse(localStorage.getItem('list')) : [];
        console.log(list2);
        this.setState({ items: this.props.list,
            selected: list2 });
    }
    
    state = {
        items: this.props.list,
        selected: list2
    };

    componentDidUpdate(prevProps) {
        if(!equal(this.props.list, prevProps.list)) 
        {
            this.setState({
                items: this.props.list,
            });
        }
    }

    // Defining unique ID for multiple lists
    id2List = {
        droppable: 'items',
        droppable2: 'selected'
    };

    getList = id => this.state[this.id2List[id]];

    onDragEnd = result => {
        const { source, destination } = result;

        console.log(this.props.list);

        if (!destination) {
            return;
        }

        // Sorting in same list
        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                this.getList(source.droppableId),
                source.index,
                destination.index
            );

            let state = { items };

            if (source.droppableId === 'droppable2') {
                state = { selected: items };
            }
            this.setState(state);
        }
        // Interlist movement
        else {
            const result = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );
            const rememberMe=true;
            localStorage.setItem('rememberMe', rememberMe);
            localStorage.setItem('list', JSON.stringify(result.droppable2));
            this.setState({
                //items: result.droppable,
                selected: result.droppable2
            });
        }
    };

    render() {
        return (
            <div>
            <div style={{ display: 'flex' }}>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}>
                                {this.state.items.map((item, index) => (
                                    <Draggable
                                        key={item.id}
                                        draggableId={item.id}
                                        index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}>
                                                {item.name}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <Droppable droppableId="droppable2">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}>
                                {this.state.selected.map((item, index) => (
                                    <Draggable
                                        key={item.id}
                                        draggableId={item.id}
                                        index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}>
                                                {item.name}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
            <Button variant="contained" color="secondary" onClick={() => {
                        this.setState({items: this.props.list, selected: []})
                        const rememberMe=false;
                        localStorage.setItem('rememberMe', rememberMe);
                        localStorage.setItem('list', []);}}>
                    Reset
            </Button>
            </div>
        );
    }
}

export default MultipleDragList;