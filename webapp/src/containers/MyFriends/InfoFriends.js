import React from "react";
import { RouteCard } from "./myfriends.style";

const InfoFriends = (props) => {
	const { name, webidFriend} = props;

	return (
		<RouteCard className="card">
			<div id="itemAmigo">
					<h3 data-testid="friendId">{name}</h3>
                    <h3 data-testid="friendweb">{webidFriend}</h3>		
            </div>          
		</RouteCard>
	);
};

export default InfoFriends;