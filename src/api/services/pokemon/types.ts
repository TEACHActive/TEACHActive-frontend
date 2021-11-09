export interface Pokemon {
  name: string;
  species: {
    name: string;
    url: string;
  };
  sprites: {
    front_shiny: string;
  };
}
