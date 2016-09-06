var data = {
  places: [
    {
      id:1,
      name:'test',
    }
  ],
  people: [
    {
      people_id: "2",
      first_name: "seconda",
      last_name: "secondb",
      user_id: '1',
      place_id: '1',
      notes: [
        {
          "id": "2",
          "type": "test",
          "text": "this a note about2"
        }
      ],
      links: [
        {
          "link_id": "2",
          "name": "second",
          "url": "thing.jpg"
        }
      ]
    }
  ],
}

var places={};
data.places.forEach(function(place){
  places[Number(place.id)]={
    id:Number(place.id),
    name:place.name,
    people:[]
  };
})
data.people.forEach(function(person){
  places[Number(person.place_id)].people.push(person);
})
