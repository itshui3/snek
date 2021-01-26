<h2>Snek Game</h2>
<ins>Client Deploy:</ins> <b>https://snek-game.vercel.app/snek</b>

The classic snake game. Player navigates the snek creature around a board with the intent of consuming fewd items. If player navigates into snek body or a wall, then the game ends. Controls are North: 'e', East: 'f', South: 'd', West: 's'. I don't do 'wasd'. 

<h2>What I learned</h2>

Similar to game of life, snek game required optimizing state updates as well as grid-mechanics. Unlike game of life though, the grid holds multiple different data types. For instance, there's food, snake, snake head. There's also a changing direction that occurs during setInterval's side-effect. Additionally, more cases could occur. For instance, snake could be running into a wall or it's own body. It could consume food(which would prompt a respawn). This made it more complex in some ways than game of life's grid which only has to determine whether a cell lives or dies. 

Oddly enough, this time I didn't run into the component re-render issue. This might be because I use immer, or (I suspect this latter reason is the case) because I hold the grid in a more flattened manner rather than rendering rows and cells as components, rows are a part of the grid component and cells are the only things rendered individually. 

To handle directionality, I realized that needing information from multiple state variables to perform some logic would get clunky within the useEffect so I wrote a helper function that receives state setters and retrieves up-to-date state to perform more complicated incremental updates. Even though it's a small and simple piece, it's also a solution I remember specifically and feel proud about coming up with. 

<h2>Technologies Used</h2>
<ins>Client:</ins> <br/>
    "immer": "^7.0.9",<br/>
    "react": "^16.13.1",<br/>

<h2>Docs</h2>
Local Boot-Up:
1] git clone -b [link]
while dir root: 
2] yarn install
3] yarn start
