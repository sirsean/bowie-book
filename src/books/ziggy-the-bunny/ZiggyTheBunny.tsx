import YamlBookWrapper from '../../components/YamlBookWrapper';

/**
 * ZiggyTheBunny book component
 *
 * Displays an interactive storybook about Princess Bowie who travels to space
 * and befriends an alien bunny named Ziggy.
 */
export default function ZiggyTheBunny(): JSX.Element {
  return <YamlBookWrapper yamlFileName="ziggy-the-bunny.yaml" />;
}
