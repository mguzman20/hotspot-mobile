import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 40,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  input: {
    height: 40,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    marginHorizontal: 0,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  textArea: {
    height: 80,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    marginHorizontal: 0,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  dropdownContainer: {
    marginBottom: 10,
    borderRadius: 5,
    width: '100%',
  },
  dropdown: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
  clickable: {
    padding: 8,
  },
  clickableText: {
    fontSize: 16,
    alignSelf: 'center',
    textDecorationLine: 'underline',
  },
  map: {
    width: '100%',
    height: 300,
    marginVertical: 10,
  },
  centerMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -10, // Ajusta la posición horizontal del icono
    marginTop: -40,  // Ajusta la posición vertical del icono
    zIndex: 3,
  },
});