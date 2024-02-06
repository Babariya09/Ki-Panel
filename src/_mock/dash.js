import { sample } from 'lodash';
import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------
const recentDate = faker.date.recent();
const formattedDate = `${recentDate.getDate()}/${recentDate.getMonth() + 1}/${recentDate.getFullYear()}`;

export const DashUSer = [...Array(24)].map((_, index) => ({
    id: faker.string.uuid(),
    Date: formattedDate,
    Description: sample([
        'Leader',
        'Hr Manager',
        'UI Designer',
        'UX Designer',
        'UI/UX Designer',
        'Project Manager',
        'Backend Developer',
        'Full Stack Designer',
        'Front End Developer',
        'Full Stack Developer',
    ]),
}));
