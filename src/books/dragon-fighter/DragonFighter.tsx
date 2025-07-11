import YamlBookWrapper from '../../components/YamlBookWrapper';

/**
 * DragonFighter book component
 *
 * Displays an interactive storybook about Princess Bowie who confronts a dragon
 * and turns an enemy into a friend through kindness.
 */
export default function DragonFighter(): JSX.Element {
  return <YamlBookWrapper yamlFileName="dragon-fighter.yaml" />;
}
