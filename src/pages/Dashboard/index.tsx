import { useEffect, useState } from 'react';
import { Food } from '../../components/Food';
import { Header } from '../../components/Header';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import api from '../../services/api';
import { FoodsContainer } from './styles';



interface DashboardProps {

}

interface FoodElement {
  id: number;
  price: number;
  name: string;
  description: string;
  image: string;
  available: boolean;
}

export function Dashboard(props: DashboardProps) {

  const [foods, setFoods] = useState<FoodElement[]>([])
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingFood, setEditingFood] = useState({} as FoodElement)

  useEffect(() => {
    api.get<FoodElement[]>('/foods').then(response => {
      setFoods(response.data)
    });

  }, [])

  const handleAddFood = async (food: FoodElement) => {

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: FoodElement) => {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  const toggleAddModal = () => {
    setAddModalOpen(!addModalOpen)
  }

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen)
  }

  const handleEditFood = (food: FoodElement) => {
    setEditingFood(food);
    setEditModalOpen(true)
  }


  return (
    <>
      <Header openModal={toggleAddModal} />

      <ModalAddFood
        isOpen={addModalOpen}
        setIsOpen={toggleAddModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            ></Food>
          ))}
      </FoodsContainer>
    </>
  );


}


// class Dashboard extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       foods: [],
//       editingFood: {},
//       modalOpen: false,
//       editModalOpen: false,
//     }
//   }

//   async componentDidMount() {
//     const response = await api.get('/foods');

//     this.setState({ foods: response.data });
//   }

//   handleAddFood = async food => {
//     const { foods } = this.state;

//     try {
//       const response = await api.post('/foods', {
//         ...food,
//         available: true,
//       });

//       this.setState({ foods: [...foods, response.data] });
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   handleUpdateFood = async food => {
//     const { foods, editingFood } = this.state;

//     try {
//       const foodUpdated = await api.put(
//         `/foods/${editingFood.id}`,
//         { ...editingFood, ...food },
//       );

//       const foodsUpdated = foods.map(f =>
//         f.id !== foodUpdated.data.id ? f : foodUpdated.data,
//       );

//       this.setState({ foods: foodsUpdated });
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   handleDeleteFood = async id => {
//     const { foods } = this.state;

//     await api.delete(`/foods/${id}`);

//     const foodsFiltered = foods.filter(food => food.id !== id);

//     this.setState({ foods: foodsFiltered });
//   }

//   toggleModal = () => {
//     const { modalOpen } = this.state;

//     this.setState({ modalOpen: !modalOpen });
//   }

//   toggleEditModal = () => {
//     const { editModalOpen } = this.state;

//     this.setState({ editModalOpen: !editModalOpen });
//   }

//   handleEditFood = food => {
//     this.setState({ editingFood: food, editModalOpen: true });
//   }

//   render() {
//     const { modalOpen, editModalOpen, editingFood, foods } = this.state;

//     return (
//       <>
//         <Header openModal={this.toggleModal} />

//         <ModalAddFood
//           isOpen={modalOpen}
//           setIsOpen={this.toggleModal}
//           handleAddFood={this.handleAddFood}
//         />
//         <ModalEditFood
//           isOpen={editModalOpen}
//           setIsOpen={this.toggleEditModal}
//           editingFood={editingFood}
//           handleUpdateFood={this.handleUpdateFood}
//         />

//         <FoodsContainer data-testid="foods-list">
//           {foods &&
//             foods.map(food => (
//               <Food
//                 key={food.id}
//                 food={food}
//                 handleDelete={this.handleDeleteFood}
//                 handleEditFood={this.handleEditFood}
//               ></Food>
//             ))}
//         </FoodsContainer>
//       </>
//     );
//   }
// };

// export default Dashboard;
