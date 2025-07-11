import YamlBookWrapper from '../../components/YamlBookWrapper';

/**
 * Superkitty Saves Bunnytown book component
 *
 * Displays an interactive storybook about a kitten named Pickle who
 * becomes a superhero to save her bunny friends from a villain.
 */
export default function SuperkittySavesBunnytown(): JSX.Element {
  return <YamlBookWrapper yamlFileName="superkitty-saves-bunnytown.yaml" />;
}
