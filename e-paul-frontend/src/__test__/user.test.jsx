import { render, screen, fireEvent, queryByAttribute  } from '@testing-library/react';
import '@testing-library/jest-dom';
import {UserCol} from '../pages/userAdministration';
import UserAdministration from '../pages/userAdministration';
import { waitFor } from "@testing-library/react";
import { DeleteIcon } from '@chakra-ui/icons';

import ChooseUser from '../pages/chooseUser.jsx';



const mockUsers = [
        {id: 1,
        username: 'Link', 
        gender: 'divers', 
        birthdate: '', 
        role: 'admin',
        },

        {id: 3,
        username: 'BEH', 
        gender: 'weiblich', 
        birthdate: '', 
        role: 'user',
        },  
]

const propsMockUsers = {
    user:
        {id: 1,
        username: 'Link', 
        gender: 'divers', 
        birthdate: '', 
        role: 'admin',
        },
        editRights: userRightsTest,
         
}

var userRightsTest = [
    {
        mayChangeUserSettings: 0,
        mayDeleteUser: 0,
        mayAssignController: 0,
        mayChangeUserType: 0,
        mayChangeUserRights: 0,

        mayAddUser: 0,
        mayChangeAccountSettings: 0,

        mayChangeOwnUserSettings: 0,
        mayDeleteSelf: 0,

        mayEditControllers: 0,
        mayDeleteControllers: 0,
    },
];


describe("Register component", () => {
    it("should render Register component correctly", () => {
      render(<UserAdministration />);
      const element = screen.getByRole('heading', {name: /benutzerverwaltung/i});
      expect(element).toBeInTheDocument();
    });
  });

test("List renders successfully", () => {
    render(<UserAdministration />)
    expect(screen.getByText(/benutzerverwaltung/i)).toBeInTheDocument();
})

it("no error messages when the load is successful", () => {
    render(<UserAdministration />);
    const alertElement = screen.queryByRole("alert");
    expect(alertElement).not.toBeInTheDocument();
});

test("should render all buttons", () => {
    render(<UserAdministration />);
    expect(screen.getByRole('button', {name: /close/i})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /benutzer hinzufügen/i})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /Kontoeinstellungen/i})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /Eigene Benutzereinstellungen öffnen/i})).toBeInTheDocument();
});



test("should render userCol correctly", () => {
    render(<UserCol user={mockUsers[0]} editRights={userRightsTest} />);
    expect(screen.getByText(/link/i)).toBeInTheDocument();
});


test("should render userCol avatars correctly", () => {
    render(<UserCol user={mockUsers[0]} editRights={userRightsTest} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
});

test("should render userCol correctly", () => {
    render(<UserCol user={mockUsers[0]} editRights={userRightsTest} />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
});

test("should render userCol users correctly", () => {
    render(<UserCol user={mockUsers[0]} editRights={userRightsTest} />);
    expect(screen.getByRole('group')).toBeInTheDocument();
});


test("should render userCol iconbutttons correctly", () => {
    render(<UserCol user={mockUsers[0]} editRights={userRightsTest} />);
    waitFor(() => expect(screen.getAllByRole('button')).not.toBeDisabled());
});

describe("UserAdministration component", () => {
    test("should render successfully", () => {
        render(<UserAdministration />);
        expect(screen.getByText(/benutzerverwaltung/i)).toBeInTheDocument();
    });

    test("should render all buttons", () => {
        render(<UserAdministration />);
        expect(screen.getByRole('button', {name: /close/i})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /benutzer hinzufügen/i})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /Kontoeinstellungen/i})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /Eigene Benutzereinstellungen öffnen/i})).toBeInTheDocument();
    });
});












