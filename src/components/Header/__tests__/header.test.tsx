
import { updateTeammate } from 'store/actions-creators/teammates';
import { TeammatesActionTypes } from 'types/teammates';

describe('Тестирование Header', () => {
  test('Должен создать экшен обновления данных сотрудника', () => {
    const payload = {
      projectId: '123',
      oldEmail: 'email@test.com',
      isOnline: true,
    };
    const expectedAction = {
      type: TeammatesActionTypes.TEAMMATE_UPDATE,
      payload,
    };

    expect(updateTeammate(payload)).toEqual(expectedAction);
  });
});