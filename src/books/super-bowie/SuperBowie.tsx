import YamlBookWrapper from '../../components/YamlBookWrapper';

/**
 * SuperBowie book component
 *
 * Displays an interactive storybook about Super Bowie's adventures
 * as a superhero helping others and saving the day.
 */
export default function SuperBowie(): JSX.Element | null {
  return <YamlBookWrapper yamlFileName="super-bowie.yaml" />;
}
