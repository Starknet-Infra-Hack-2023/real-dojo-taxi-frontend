import { useDojo } from './DojoContext';
import { Direction, } from './dojo/createSystemCalls'
import { useComponentValue } from "@latticexyz/react";
import { Entity, setComponent } from '@latticexyz/recs';
import { useEffect } from 'react';
import { getFirstComponentByType, setComponentsFromGraphQLEntities } from './utils';
import { Moves, Position } from './generated/graphql';

function App() {
  const {
    setup: {
      systemCalls: { spawn, move },
      components,
      network: { graphSdk }
    },
    account: { create, list, select, account, isDeploying }
  } = useDojo();

  // extract query
  const { getEntities } = graphSdk()

  // entity id - this example uses the account address as the entity id
  const entityId = account.address.toString();

  // get current component values
  const position = useComponentValue(components.Position, entityId as Entity);
  const moves = useComponentValue(components.Moves, entityId as Entity);

  // use graphql to current state data
  useEffect(() => {



    if (!entityId) return;

    const fetchData = async () => {
      const { data } = await getEntities()

      console.log(data)

      if (data.entities) {

        console.log(data.entities)
        const remaining = getFirstComponentByType(data.entities?.edges, 'Moves') as Moves;
        const position = getFirstComponentByType(data.entities?.edges, 'Position') as Position;

        setComponentsFromGraphQLEntities(components, data.entities?.edges)

        // setComponent(Moves, entityId as Entity, { remaining: BigInt(remaining.remaining), last_direction: BigInt(remaining.last_direction) })

        // setComponent(Position, entityId as EntityIndex, { x: position.vec?.x, y: position.vec?.y })
      }
    }
    fetchData();
  }, [account.address]);


  return (
    <>
      <button onClick={create}>{isDeploying ? "deploying burner" : "create burner"}</button>
      <div className="card">
        select signer:{" "}
        <select onChange={e => select(e.target.value)}>
          {list().map((account, index) => {
            return <option value={account.address} key={index}>{account.address}</option>
          })}
        </select>
      </div>
      <div className="card">
        <button onClick={() => spawn(account)}>Spawn</button>
        <div>Moves Left: {moves ? `${moves['remaining']}` : 'Need to Spawn'}</div>
        <div>Position: {position ? `${position['x']}, ${position['y']}` : 'Need to Spawn'}</div>
      </div>
      <div className="card">
        <button onClick={() => move(account, Direction.Up)}>Move Up</button> <br />
        <button onClick={() => move(account, Direction.Left)}>Move Left</button>
        <button onClick={() => move(account, Direction.Right)}>Move Right</button> <br />
        <button onClick={() => move(account, Direction.Down)}>Move Down</button>
      </div>
    </>
  );
}

export default App;
